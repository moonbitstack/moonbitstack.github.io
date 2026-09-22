// React, because this is a form action with a pending state, which is exactly
// what React 19 grew `useActionState` for: the copy, the confirmation and the
// return to rest are one async function, with no state variable and no timer
// held outside it.

import { useActionState } from 'react'

const command = 'moon add moonbitstack/moonapi'
const shown = 1600

export default function Install() {
  const [, copy, copying] = useActionState(async () => {
    await navigator.clipboard.writeText(command)
    await new Promise(done => setTimeout(done, shown))
  }, undefined)

  return (
    <form action={copy} className="install">
      <code>{command}</code>
      <button type="submit" aria-label="Copy the install command">
        {copying ? 'copied' : 'copy'}
      </button>
    </form>
  )
}
