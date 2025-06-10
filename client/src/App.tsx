// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import useAppStore from './store'
import './App.css'
import { useEffect } from 'react'

function App() {
  const { views, activeId, setViews, setActiveId } = useAppStore()

  const getViews = () => {
    window.x.getViews().then(({views, activeId}) => {
      setViews(views)
      setActiveId(activeId)
    })
  }

  useEffect(() => {
    getViews()
    const unbind = window.x.onViewAdd((views, viewAdd) => {
      setViews(views)
      setActiveId(viewAdd.id)
      console.log(views, viewAdd)
    })
    return () => {
      unbind()
    }
  }, [])


  return (
    <div style={{height: 80, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100vw', justifyContent: 'space-between'}}>
      {/* tabs */}
      <div className='tabs'>
        <ul className='view-tabs'>
          {
            views.map(v => {
              return <li key={v.id} className={v.id === activeId ? 'active' :''} onClick={() => {
                window.x.switchView(v.id)
                getViews()
              }}>
                <div className='tab-name'>{v.title}</div>
                <div className='tab-close' onClick={(e) => {
                  e.stopPropagation()
                  window.x.closeView(v.id)
                  getViews()
                }}></div>
              </li>
            })
          }
        </ul>
        <ul className='app-btns'>
          <li className='app-min' onClick={() => {
            window.x.minimize()
          }}></li>
          <li className='app-max' onClick={() => {
            window.x.maximize()
          }}></li>
          <li className='app-close' onClick={() => {
            window.x.close()
          }}></li>
        </ul>
      </div>
      {/* address bar */}
      <div className='address'>
        <ul className='nav-tools'>
          <li className='icon' onClick={() => {
            window.x.back()
          }}></li>
          <li className='icon' onClick={() => {
            window.x.forward()
          }}></li>
          <li className='icon' onClick={() => {
            window.x.reload()
          }}></li>
          <li className='icon'></li>
        </ul>
        <input value={views.find(item => item.id === activeId)?.url} />
        <ul className='settings'>
          <li className='icon'></li>
          <li className='icon'></li>
        </ul>
      </div>
    </div>
  )
}

export default App
