import type {SceneSpec} from '../types';
import {EndScene} from './EndScene';
import {ListScene} from './ListScene';
import {QuoteScene} from './QuoteScene';
import {StatementScene} from './StatementScene';
import {StatScene} from './StatScene';
import {TitleScene} from './TitleScene';

// `duration` is in 30 fps beats.
export const Scene: React.FC<{spec: SceneSpec; duration: number}> = ({spec, duration}) => {
  switch (spec.type) {
    case 'title':
      return <TitleScene spec={spec} duration={duration} />;
    case 'statement':
      return <StatementScene spec={spec} duration={duration} />;
    case 'stat':
      return <StatScene spec={spec} duration={duration} />;
    case 'list':
      return <ListScene spec={spec} duration={duration} />;
    case 'quote':
      return <QuoteScene spec={spec} duration={duration} />;
    case 'end':
      return <EndScene spec={spec} duration={duration} />;
  }
};
