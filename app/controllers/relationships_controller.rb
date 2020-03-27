class RelationshipsController < ApplicationController
  before_action :set_user

  def create
    @user = User.find(params[:relationship][:follow_id])
    following = current_user.follow(@user)
    respond_to do |format|
    format.html {redirect_to user}
    format.json
    end
  end

  def destroy
    user = User.find(params[:relationship][:follow_id])
    following = current_user.unfollow(user)
    respond_to do |format|
      format.html {redirect_to user}
      format.js
      end
  end

  private

  def set_user
    user = User.find(params[:relationship][:follow_id])
  end

end
