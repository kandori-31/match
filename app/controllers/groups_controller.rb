class GroupsController < ApplicationController
  
  def create
    @group = Group.create
    @entry1 = GroupUser.create(group_id: @group.id, user_id: current_user.id)
    @entry2 = GroupUser.create(params.require(:group_user).permit(:user_id, :group_id).merge(group_id: @group.id))
      redirect_to group_path(@group.id)
  
  end
  def show 
    @group = Group.find(params[:id])
    if GroupUser.where(user_id: current_user.id, group_id: @group.id).present?
      @messages = @group.messages
      @message = Message.new
      @entries = @group.group_users
    else
      redirect_back(fallback_location: root_path)
    end
  end

  
end