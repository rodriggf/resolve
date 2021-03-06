const listProperties = async (req, res) => {
  const { listenerId } = req.query
  const listProperties = await req.resolve.publisher.listProperties({
    eventSubscriber: listenerId
  })
  res.json(listProperties)
}

export default listProperties
