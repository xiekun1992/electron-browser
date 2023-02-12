function App() {
  const [tabs, setTabs] = React.useState([
    // {id, active, title, url}
  ])
  const [activeTab, setActiveTab] = React.useState(null)

  React.useEffect(() => {
    renderer.on('tabs.update', (event, args) => {
      console.log(args)
      setTabs(args.tabs)
      setActiveTab(args.tabs.find(t => t.active))
    })
  }, [])

  return (
    <>
      <Header tabs={tabs} />
      <Address activeTab={activeTab} />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'))