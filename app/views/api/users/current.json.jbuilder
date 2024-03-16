json.user do
  if @user
    json.extract! @user, :id, :username, :first_name, :last_name, :email
  else
    json.user nil
  end
end