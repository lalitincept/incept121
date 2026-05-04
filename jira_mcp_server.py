#!/usr/bin/env python3
"""Jira Cloud MCP Server — exposes Jira operations as MCP tools."""

import os
import json
from typing import Any
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import mcp.server.stdio
import mcp.types as types
from mcp.server import Server

load_dotenv()

JIRA_URL = os.environ.get("JIRA_URL", "").rstrip("/")
JIRA_EMAIL = os.environ.get("JIRA_EMAIL", "")
JIRA_API_TOKEN = os.environ.get("JIRA_API_TOKEN", "")

server = Server("jira-mcp")


def _auth() -> HTTPBasicAuth:
    return HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)


def _headers() -> dict:
    return {"Accept": "application/json", "Content-Type": "application/json"}


def _get(path: str, params: dict | None = None) -> Any:
    resp = requests.get(
        f"{JIRA_URL}/rest/api/3{path}",
        auth=_auth(),
        headers=_headers(),
        params=params,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def _post(path: str, body: dict) -> Any:
    resp = requests.post(
        f"{JIRA_URL}/rest/api/3{path}",
        auth=_auth(),
        headers=_headers(),
        json=body,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def _put(path: str, body: dict) -> Any:
    resp = requests.put(
        f"{JIRA_URL}/rest/api/3{path}",
        auth=_auth(),
        headers=_headers(),
        json=body,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json() if resp.content else {"status": "ok"}


@server.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_issue",
            description="Get a Jira issue by its key (e.g. PROJ-123). Returns summary, status, assignee, description, comments, and more.",
            inputSchema={
                "type": "object",
                "properties": {
                    "issue_key": {"type": "string", "description": "Jira issue key, e.g. PROJ-123"}
                },
                "required": ["issue_key"],
            },
        ),
        types.Tool(
            name="search_issues",
            description="Search Jira issues using JQL (Jira Query Language). Returns a list of matching issues.",
            inputSchema={
                "type": "object",
                "properties": {
                    "jql": {"type": "string", "description": "JQL query string, e.g. 'project = PROJ AND status = \"In Progress\"'"},
                    "max_results": {"type": "integer", "description": "Maximum number of results to return (default 20, max 50)", "default": 20},
                },
                "required": ["jql"],
            },
        ),
        types.Tool(
            name="create_issue",
            description="Create a new Jira issue.",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_key": {"type": "string", "description": "Project key, e.g. PROJ"},
                    "summary": {"type": "string", "description": "Issue title/summary"},
                    "issue_type": {"type": "string", "description": "Issue type: Story, Bug, Task, Epic, etc.", "default": "Task"},
                    "description": {"type": "string", "description": "Issue description (plain text)"},
                    "assignee_account_id": {"type": "string", "description": "Atlassian account ID of the assignee (optional)"},
                    "priority": {"type": "string", "description": "Priority: Highest, High, Medium, Low, Lowest (optional)"},
                    "labels": {"type": "array", "items": {"type": "string"}, "description": "Labels to add (optional)"},
                },
                "required": ["project_key", "summary"],
            },
        ),
        types.Tool(
            name="update_issue",
            description="Update fields on an existing Jira issue.",
            inputSchema={
                "type": "object",
                "properties": {
                    "issue_key": {"type": "string", "description": "Jira issue key, e.g. PROJ-123"},
                    "summary": {"type": "string", "description": "New summary (optional)"},
                    "description": {"type": "string", "description": "New description in plain text (optional)"},
                    "priority": {"type": "string", "description": "New priority (optional)"},
                    "assignee_account_id": {"type": "string", "description": "New assignee account ID (optional)"},
                    "labels": {"type": "array", "items": {"type": "string"}, "description": "New labels list (replaces existing, optional)"},
                },
                "required": ["issue_key"],
            },
        ),
        types.Tool(
            name="add_comment",
            description="Add a comment to a Jira issue.",
            inputSchema={
                "type": "object",
                "properties": {
                    "issue_key": {"type": "string", "description": "Jira issue key, e.g. PROJ-123"},
                    "comment": {"type": "string", "description": "Comment text to add"},
                },
                "required": ["issue_key", "comment"],
            },
        ),
        types.Tool(
            name="get_transitions",
            description="Get available workflow transitions for a Jira issue (i.e. what statuses it can move to).",
            inputSchema={
                "type": "object",
                "properties": {
                    "issue_key": {"type": "string", "description": "Jira issue key, e.g. PROJ-123"}
                },
                "required": ["issue_key"],
            },
        ),
        types.Tool(
            name="transition_issue",
            description="Transition a Jira issue to a new status (e.g. move to 'In Progress' or 'Done').",
            inputSchema={
                "type": "object",
                "properties": {
                    "issue_key": {"type": "string", "description": "Jira issue key, e.g. PROJ-123"},
                    "transition_id": {"type": "string", "description": "Transition ID from get_transitions"},
                },
                "required": ["issue_key", "transition_id"],
            },
        ),
        types.Tool(
            name="list_projects",
            description="List all Jira projects accessible with the current credentials.",
            inputSchema={"type": "object", "properties": {}},
        ),
        types.Tool(
            name="get_my_issues",
            description="Get all issues assigned to the authenticated user that are not Done.",
            inputSchema={
                "type": "object",
                "properties": {
                    "max_results": {"type": "integer", "description": "Maximum results (default 20)", "default": 20}
                },
            },
        ),
    ]


def _format_issue(issue: dict) -> str:
    fields = issue.get("fields", {})
    key = issue.get("key", "")
    summary = fields.get("summary", "")
    status = fields.get("status", {}).get("name", "")
    assignee = (fields.get("assignee") or {}).get("displayName", "Unassigned")
    priority = (fields.get("priority") or {}).get("name", "")
    issue_type = (fields.get("issuetype") or {}).get("name", "")
    reporter = (fields.get("reporter") or {}).get("displayName", "")
    labels = ", ".join(fields.get("labels", [])) or "none"
    created = fields.get("created", "")[:10]
    updated = fields.get("updated", "")[:10]

    # Extract plain text from description (ADF format)
    desc_text = _extract_adf_text(fields.get("description"))

    # Comments
    comments_data = (fields.get("comment") or {}).get("comments", [])
    comments_text = ""
    for c in comments_data[-5:]:  # last 5 comments
        author = (c.get("author") or {}).get("displayName", "")
        body = _extract_adf_text(c.get("body"))
        comments_text += f"\n  [{author}]: {body}"

    return (
        f"Key: {key}\n"
        f"Type: {issue_type}\n"
        f"Summary: {summary}\n"
        f"Status: {status}\n"
        f"Priority: {priority}\n"
        f"Assignee: {assignee}\n"
        f"Reporter: {reporter}\n"
        f"Labels: {labels}\n"
        f"Created: {created} | Updated: {updated}\n"
        f"Description:\n{desc_text or '(none)'}\n"
        f"Comments (last 5):{comments_text or ' (none)'}"
    )


def _extract_adf_text(node: Any) -> str:
    """Recursively extract plain text from Atlassian Document Format."""
    if node is None:
        return ""
    if isinstance(node, str):
        return node
    if isinstance(node, dict):
        if node.get("type") == "text":
            return node.get("text", "")
        parts = []
        for child in node.get("content", []):
            parts.append(_extract_adf_text(child))
        return " ".join(p for p in parts if p)
    return ""


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    try:
        result = _dispatch(name, arguments)
    except requests.HTTPError as e:
        result = f"Jira API error: {e.response.status_code} {e.response.text}"
    except Exception as e:
        result = f"Error: {e}"

    return [types.TextContent(type="text", text=result)]


def _dispatch(name: str, args: dict) -> str:
    if name == "get_issue":
        issue = _get(f"/issue/{args['issue_key']}",
                     params={"fields": "summary,status,assignee,reporter,priority,issuetype,description,comment,labels,created,updated"})
        return _format_issue(issue)

    elif name == "search_issues":
        max_results = min(args.get("max_results", 20), 50)
        data = _get("/search", params={
            "jql": args["jql"],
            "maxResults": max_results,
            "fields": "summary,status,assignee,priority,issuetype",
        })
        issues = data.get("issues", [])
        if not issues:
            return "No issues found."
        lines = [f"Found {data.get('total', len(issues))} issue(s) (showing {len(issues)}):"]
        for issue in issues:
            f = issue.get("fields", {})
            status = f.get("status", {}).get("name", "")
            assignee = (f.get("assignee") or {}).get("displayName", "Unassigned")
            priority = (f.get("priority") or {}).get("name", "")
            lines.append(f"  {issue['key']} [{f.get('issuetype',{}).get('name','')}] {f.get('summary','')} | {status} | {assignee} | {priority}")
        return "\n".join(lines)

    elif name == "create_issue":
        fields: dict = {
            "project": {"key": args["project_key"]},
            "summary": args["summary"],
            "issuetype": {"name": args.get("issue_type", "Task")},
        }
        if "description" in args:
            fields["description"] = {
                "type": "doc", "version": 1,
                "content": [{"type": "paragraph", "content": [{"type": "text", "text": args["description"]}]}],
            }
        if "assignee_account_id" in args:
            fields["assignee"] = {"accountId": args["assignee_account_id"]}
        if "priority" in args:
            fields["priority"] = {"name": args["priority"]}
        if "labels" in args:
            fields["labels"] = args["labels"]

        result = _post("/issue", {"fields": fields})
        key = result.get("key", "")
        return f"Created issue {key}: {JIRA_URL}/browse/{key}"

    elif name == "update_issue":
        fields: dict = {}
        if "summary" in args:
            fields["summary"] = args["summary"]
        if "description" in args:
            fields["description"] = {
                "type": "doc", "version": 1,
                "content": [{"type": "paragraph", "content": [{"type": "text", "text": args["description"]}]}],
            }
        if "priority" in args:
            fields["priority"] = {"name": args["priority"]}
        if "assignee_account_id" in args:
            fields["assignee"] = {"accountId": args["assignee_account_id"]}
        if "labels" in args:
            fields["labels"] = args["labels"]

        if not fields:
            return "No fields provided to update."

        _put(f"/issue/{args['issue_key']}", {"fields": fields})
        return f"Updated {args['issue_key']} successfully."

    elif name == "add_comment":
        body = {
            "body": {
                "type": "doc", "version": 1,
                "content": [{"type": "paragraph", "content": [{"type": "text", "text": args["comment"]}]}],
            }
        }
        result = _post(f"/issue/{args['issue_key']}/comment", body)
        return f"Comment added to {args['issue_key']} (comment ID: {result.get('id', '')})."

    elif name == "get_transitions":
        data = _get(f"/issue/{args['issue_key']}/transitions")
        transitions = data.get("transitions", [])
        if not transitions:
            return "No transitions available."
        lines = ["Available transitions:"]
        for t in transitions:
            lines.append(f"  ID: {t['id']} → {t['name']}")
        return "\n".join(lines)

    elif name == "transition_issue":
        _post(f"/issue/{args['issue_key']}/transitions", {"transition": {"id": args["transition_id"]}})
        return f"Transitioned {args['issue_key']} successfully."

    elif name == "list_projects":
        projects = _get("/project/search", params={"maxResults": 50})
        items = projects.get("values", [])
        if not items:
            return "No projects found."
        lines = [f"Found {len(items)} project(s):"]
        for p in items:
            lines.append(f"  {p['key']} — {p['name']} ({p.get('projectTypeKey', '')})")
        return "\n".join(lines)

    elif name == "get_my_issues":
        max_results = min(args.get("max_results", 20), 50)
        data = _get("/search", params={
            "jql": "assignee = currentUser() AND statusCategory != Done ORDER BY updated DESC",
            "maxResults": max_results,
            "fields": "summary,status,priority,issuetype,project",
        })
        issues = data.get("issues", [])
        if not issues:
            return "No open issues assigned to you."
        lines = [f"Your open issues ({len(issues)} of {data.get('total', len(issues))}):"]
        for issue in issues:
            f = issue.get("fields", {})
            status = f.get("status", {}).get("name", "")
            priority = (f.get("priority") or {}).get("name", "")
            project = f.get("project", {}).get("key", "")
            lines.append(f"  {issue['key']} [{project}] {f.get('summary','')} | {status} | {priority}")
        return "\n".join(lines)

    else:
        return f"Unknown tool: {name}"


async def main():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
