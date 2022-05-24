Rails.application.routes.draw do
  devise_for :users, :controllers => { registrations: 'users/registrations' }
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  #devise_scope :user do
    #root to: "devise/sessions#create"
  #end
  devise_scope :user do
    get '/users/sign_out' => 'devise/sessions#destroy'
  end
  root "quest#result"
  get 'quest/identification'
  get 'quest/try'
  #get 'index/greeting'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
