Rails.application.routes.draw do
  root  "users#index"
  devise_for :users
  get '/follower', to: 'users#follower'
  resources :users, only: [:index, :edit, :update, :show,]
  resources :relationships, only: [:create, :destroy]
  resources :likes, only: [:index]
  resources :messages, only: [:index, :create]
  resources :groups, only: [:create, :show] do 
    #namespaceを用いることでmessagesコントローラーを分けている
    namespace :api do
      resources :messages, only: :index, defaults: {format:'json'}
    end
  end
end
