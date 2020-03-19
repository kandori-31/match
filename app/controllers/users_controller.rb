class UsersController < ApplicationController
  def index
    @users=User.all
  end

  def indeex
    @users=current_user.followers
  end
  def edit
  end

  def show
    @user = User.find(params[:id])
    @relationship = Relationship.new
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
