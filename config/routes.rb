# Rails.application.routes.draw do
# Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

# Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
# Can be used by load balancers and uptime monitors to verify that the app is live.
# get "up" => "rails/health#show", as: :rails_health_check

# Defines the root path route ("/")
# root "posts#index"
# end

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show]
    resources :tags, only: [:index]
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/current', to: 'users#current'
    resources :recipes, only: [:create, :show, :update, :index, :destroy]
    put '/recipes/:id/upload_image', to: 'recipes#upload_image'
  end
  
  root 'static_pages#root'

  get '*path', to: 'static_pages#root', constraints: ->(request) do
  !request.xhr? && request.format.html?
  end

end