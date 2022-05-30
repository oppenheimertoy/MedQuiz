class QuestController < ApplicationController
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token, only: :user_answer
  
  def identification
  end

  def try
  end

  # Метод, принимающий результат теста
  def user_answer
    print params

    
    render plain: "Response text"
  end

  def result
  end

end
