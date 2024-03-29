function submit (e) {
  e.preventDefault()
  
}
function focus (e) {
  e.target.selectionStart = e.target.selectionEnd = -1
  setTimeout(() => {
    e.target.select()
  }, 200)
}
function blur (e) {
  e.target.selectionStart = e.target.selectionEnd = -1
  // window.getSelection().removeAllRanges()
}

function Address({ activeTab }) {
  const [url, setUrl] = React.useState('https://www.baidu.com')
  const changeUrl = (e) => {
    console.log(e.target.value)
    setUrl(e.target.value)
    navigateURL(e.target.value)
  }
  React.useEffect(() => {
    if (activeTab) {
      setUrl(activeTab.url)
    }
  }, [activeTab])

  return (
    <div className='address-bar'>
      <ul className='navigate-btns'>
        <li className='backward' onClick={backward}>
          <span className='icon-arrow-left2'></span>
        </li>
        <li className='forward' onClick={forward}>
          <span className='icon-arrow-right2'></span>
        </li>
        <li className='refresh' onClick={refresh}>
          <span className='icon-spinner11'></span>
        </li>
        <li className='home' onClick={home}>
          <span className='icon-home2'></span>
        </li>
      </ul>
      <form onSubmit={submit}>
        <div>
          <i className='safe-icon'>
            <span className='icon-lock'></span>
          </i>
          <input
            name='inputUrl'
            value={url}
            onChange={changeUrl}
            spellCheck='false'
            onFocus={focus}
            onBlur={blur}
          />
          <i className='bookmark'>
            <span className='icon-star-empty'></span>
          </i>
        </div>
      </form>
    </div>
  )
}