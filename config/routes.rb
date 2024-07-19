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
    resources :users, only: %i[create show]
    resources :tags, only: [:index]
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/current', to: 'users#current'
    get '/recipes/:id/tags', to: 'recipes#tags_by_recipe'
    resources :recipes, only: %i[create show update index destroy]
    put '/recipes/:id/upload_image', to: 'recipes#upload_image'
  end

  root 'static_pages#root'

  # Catch-all route to handle all unmatched requests.
  # This route is necessary to serve the frontend application's index.html file
  # for all routes that are not handled by the API or other routes defined above.
  # It ensures that the React application is rendered correctly for client-side routing.
  get '*path', to: 'static_pages#root', constraints: lambda { |request|
    !request.xhr? && request.format.html?
  }
end
