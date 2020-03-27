json.set! :name, @user.name
json.image @user.image.url
json.cu_image current_user.image.url
json.cu_name current_user.name

