import compact from 'lodash/compact';

export const joinCommands = commands => compact(commands).join(' && ');