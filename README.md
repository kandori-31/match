
# Matchapp

## アプリの説明
### 簡易的なマッチングアプリです
気にいった相手をいいねすることができます
<br>
また、いいねした際に相手からもいいねされているとマッチング演出が起こります
<br>
そして、マッチングした相手とはメッセージのやりとりを行うことができます

## 工夫したポイント
javascriptのライブラリであるmo.jsを用いてマッチングの際の演出を豪華にしました

## 制作背景
要変更 スクールのカリキュラムで学習していない技術を用いてアプリを制作したかったからです

## 本番環境
https://matchap.herokuapp.com/
<br>
男性用テストアカウント
<br>
email: male@gmail.com
<br>
password: testtest
<br>

女性用テストアカウント
<br>
email: femail@gmail.com
<br>
password: testtest



## 環境構築
git clone https://github.com/kandori-31/match.git
<br>
$ cd match
<br>
$ bundle install
<br>
$ rails db:create
<br>
$ rails db:migrate
<br>
$ rails s
<br>
http://localhost:3000

## DEMO
### トップページ
![トップページ](https://user-images.githubusercontent.com/61687923/80054082-5c93e000-8559-11ea-83e6-4cdc3ae09831.png)
<br>
  トップページには自分と性別の違う相手の一覧が表示されます

### 詳細ページ
![詳細ページ](https://user-images.githubusercontent.com/61687923/80054235-9f55b800-8559-11ea-9d65-332e2890995f.png)
<br>
  ユーザーの詳細ページです
  <br>
  このページでいいねをすることができ、マッチング後はメッセージを送ることができます
  <br>

### マッチング演出
![マッチング演出](https://user-images.githubusercontent.com/61687923/80306401-0c897780-87fe-11ea-9627-123b6abdb794.gif)
<br>
  mo.jsのburstで花火をあげ、boundで要素を弾ませています

## 使用技術
 ruby html(haml) css(scss) javascript(jQuery, mo.js)

## 課題や今後実装したい機能
  メッセージ一覧
  <br>
  検索機能
  <br>
  より詳細なユーザー情報
  <br>
  自身と似ているユーザーを優先的に一覧に表示する
  <br>
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
|user_id|references|null:false, foreign_key: true|
### Association
- belongs_to :user
- belongs_to :group

## messagesテーブル
|Column|Type|Options|
|------|----|-------|
|content|strng|null:false|
|group_id|references|null:false, foreign_key: true|
|user_id|references|null:false, foreign_key: true|
### Association
- belongs_to :user
- belongs_to :group