import magicStories from 'storybook-helpers/magic-stories';
import Bar from './index';

magicStories(Bar, 'Processes > Bar', { defaultStyles: { columns: 1 }, nameProp: 'title' });
