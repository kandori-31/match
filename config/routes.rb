Rails.application.routes.draw do
  root  "users#index"
  devise_for :users
  get '/inddex', to: 'users#inddex'
  resources :users, only: [:index, :edit, :update, :show,]
  resources :relationships, only: [:create, :destroy]
  resources :likes, only: [:index]
end
