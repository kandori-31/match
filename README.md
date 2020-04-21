
# Matchapp

## アプリの説明
### 簡易的なマッチングアプリです
気にいった相手をいいねすることができます
また、いいねした際に相手からもいいねされているとマッチング演出が起こります
そして、マッチングした相手とはメッセージのやりとりを行うことができます

## 工夫したポイント
javascriptのライブラリであるmo.jsを用いてマッチングの際の演出を豪華にしました

## 制作背景
スクールのカリキュラムで学習していない技術を用いてアプリを制作したかったからです

## 本番環境


## 環境構築
git clone https://github.com/kandori-31/match.git
$ cd match
$ bundle install
$ rails db:create
$ rails db:migrate
$ rails s
http://localhost:3000

## DEMO
![トップページ](https://gyazo.com/9caa30cf78e1821775eaf1ce8b3e92b5)
  トップページには自分と性別の違う相手の一覧が表示されます
![詳細ページ](https://gyazo.com/11392cbddcdfe07059c516f7046e601c)
  ユーザーの詳細ページです
  このページでいいねをすることができ、マッチングした際にはメッセージに飛ぶことができます
![マッチング演出](https://gyazo.com/00fcc28ec9ef522115e6c5e6567d70e0)
  mo.jsのburstで花火をあげ、boundで要素を弾ませています

## 使用技術
 ruby html(haml) css(scss) javascript(jQuery, mo.js)

## 課題や今後実装したい機能
  メッセージ一覧
  検索機能
  より詳細なユーザー情報
  自身と似ているユーザーを優先的に一覧に表示する
  並べ替え

## DB設計
### usersテーブル
|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|gender|string|null: false|
|image|string|
|email|string|null: false|
|introduction|text|null: false|
|password|text|null: false|
### Association
- has_many :relationships
- has_many :followings, through, :relationships, source: follow
- has_many :reverse_of_relationships,class_name: "Relationship", foreign_key: 'follow_id' 
- has_many :followers, through, :reverse_of_relationships, source: :user
- has_many :group_users
- has_many :groups, through: :group_users

### relationshipsテーブル
|Column|Type|Options|
|------|----|-------|
|user_id|references|foreign_key: true|
|follow|references|foreign_key: true|
### Association
- belongs_to :follow, class_name: 'User'
- belongs_to :user

## groupsテーブル
|Column|Type|Options|
|------|----|-------|
|name|string|
### Association
- has_many :group_users
- has_many :users, through: :group_users
- has_many :messages

## group_usersテーブル
|Column|Type|Options|
|------|----|-------|
|group_id|references|null: false,foreign_key: true|
|user_id|refernces|null:false, foreign_key: true|
### Association
- belongs_to :user
- belongs_to :group

## messagesテーブル
|Column|Type|Options|
|------|----|-------|
|content|strng|null:false, foreign_key: true|
|group_id|references|null:false, foreign_key: true|
|user_id|references|null:false, foreign_key: true|
### Association
- belongs_to :user
- belongs_to :group