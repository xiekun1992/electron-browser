function Header ({ tabs }) {

  return (
    <header>
      <ul className='tabs'>
        {
          tabs.map((tab) => {
            return (
              <li
                onClick={() => {
                  setActiveViewById(tab.id)
                }}
                className={`tab ${tab.active? 'active': ''}`}
                key={tab.id}
              >
                <span>{tab.title}</span>
                <i
                  className='close-tab'
                  onClick={() => {
                    deleteActiveViewById(tab.id)
                  }}
                >&times;</i>
              </li>
            )
          })
        }
        <li className='add-tab' onClick={() => {
          createNewView()
        }}>+</li>
      </ul>
      <ul className='window-actions'>
        <li className='window-minimize' onClick={minimize}></li>
        <li className='window-maximize' onClick={maximize}></li>
        <li className='window-close' onClick={close}></li>
      </ul>
    </header>
  )
}