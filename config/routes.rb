Rails.application.routes.draw do
  root  "users#index"
  devise_for :users
  get '/follower', to: 'users#follower'
  resources :users, only: [:index, :edit, :update, :show,]
  resources :relationships, only: [:create, :destroy]
  resources :likes, only: [:index]
  resources :groups, only: [:create, :show]  
  resources :messages, only: [:index, :create]
  
end
