class QuestController < ApplicationController
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  
  def identification
  end

  def try
  end

  def result
  end
end
