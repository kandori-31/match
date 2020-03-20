class LikesController < ApplicationController
  def index
    @users = current_user.matcher
  end
end
