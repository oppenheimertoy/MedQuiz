Rails.application.routes.draw do
  devise_for :users, :controllers => { registrations: 'users/registrations' }
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  root "quest#try"
  get 'quest/identification'
  get 'quest/try'
  get 'quest/result'

  
  #get 'index/greeting'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
