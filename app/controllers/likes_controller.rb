class LikesController < ApplicationController
  def index
    @users = User.all
  end
end
