Rails.application.routes.draw do
  root "quest#identification"
  get 'quest/identification'
  get 'quest/try'
  get 'quest/result'
  
  #get 'index/greeting'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
