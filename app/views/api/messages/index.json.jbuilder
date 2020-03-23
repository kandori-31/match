json.array! @messages do |message|
  json.content message.content
  json.image message.image.url
  json.id message.id
end