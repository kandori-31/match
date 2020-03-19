class RelationshipsController < ApplicationController
  before_action :set_user

  def create
    user = User.find(params[:relationship][:follow_id])
    following = current_user.follow(user)
    redirect_to user
  end

  def destroy
    user = User.find(params[:relationship][:follow_id])
    following = current_user.unfollow(user)
    redirect_to user
  end

  private

  def set_user
    user = User.find(params[:relationship][:follow_id])
  end

end
