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
                >
                  <span className='icon-cross'></span>
                </i>
              </li>
            )
          })
        }
        <li className='add-tab' onClick={() => {
          createNewView()
        }}>
          <span className='icon-plus'></span>
        </li>
      </ul>
      <ul className='window-actions'>
        <li className='window-minimize' onClick={minimize}>
          <span className='icon-minus'></span>
        </li>
        <li className='window-maximize' onClick={maximize}>
          <span className='icon-checkbox-unchecked'></span>
        </li>
        <li className='window-close' onClick={close}>
          <span className='icon-cross'></span>
        </li>
      </ul>
    </header>
  )
}