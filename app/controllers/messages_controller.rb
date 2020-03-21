class MessagesController < ApplicationController
  before_action :authenticate_user!, only: [:create]

  def create 
    if GroupUser.where(user_id: current_user.id, group_id: params[:message][:group_id]).present?
      @message = Message.create(message_params)
    end
    redirect_to group_path(@message.group_id)
end

  private

  def message_params
    params.require(:message).permit(:user_id, :content, :group_id).merge(user_id: current_user.id)
  end
end
