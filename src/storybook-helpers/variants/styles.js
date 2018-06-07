import { grid } from 'styles/mixins';

export default {
  all: ({ hasPadding } = {}) => ({
    display: 'flex',
    flexDirection: 'column',
    ...(hasPadding && {
      padding: 20
    })
  }),
  debug: () => ({
    marginBottom: 15,
    fontSize: 11,
    width: 350,
    height: 110
  }),
  variant: ({ variantSpace = 10 } = {}) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: variantSpace,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    position: 'relative'
  }),
  variation: ({} = {}) => ({
    display: 'flex',
    flexDirection: 'column'
  }),
  title: () => ({
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
    backgroundColor: 'rgba(255,255,255, 0.05)',
    borderRadius: 5,
    padding: '5px 8px'
  }),
  inside: ({ hasPadding = true } = {}) => ({
    ...(hasPadding && { padding: 20 })
  }),
  list: ({ columns = 5, spacing = 15 } = {}) => ({
    ...grid(columns, { gap: spacing })
  }),
  name: ({ center = false } = {}) => ({
    fontSize: 14,
    fontWeight: 300,
    marginBottom: 10,
    color: 'white',
    ...(center && { textAlign: 'center' })
  })
};
