class UsersController < ApplicationController
  def index
    @users=User.where.not(gender: current_user.gender)
  end

  def follower
    @users = current_user.followers
  end

  def edit
  end

  def show
    @user = User.find(params[:id])
    @relationship = Relationship.new
    @currentUserEntry = GroupUser.where(user_id: current_user.id)
    @userEntry = GroupUser.where(user_id: @user.id)
    unless @user.id == current_user.id
    @currentUserEntry.each do |cu|
      @userEntry.each do |u|
        if cu.group_id == u.group_id 
          @isGroup = true
          @groupId = cu.group_id
    end
  end
end

      unless @isGroup
        @group =Group.new
        @group_user = GroupUser.new
    end
  end
end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :introduction, :image)
  end
end
