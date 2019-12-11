# Quillsy_App
A NodeJS web application for sharing your ideas, thoughts, poems, quotes, short stories  and more.
Inspired from YelpCamp Project from The Web Developer Bootcamp by Colt Steele.

## Features -
### Authentication:
* User signup with username and password, no email required
* User login with username and password
### Authorization:
  * -One cannot create new posts or comments without being authenticated
  * -One cannot edit or delete existing posts and comments created by other users
  * -User can delete unwanted/explicit comments if the post belongs to him/her
  * -User can report explicit posts or fake users
* Flash messages responding to users’ interaction with the app
* Responsive web design
* Functionalities of posts and comments:
* -Create, view, edit and delete posts and comments
* -Upload background photos via URL
* -Add emojis to blog posts for rich user experience

### Custom Enhancements
* -Delete associated comments when deleting post
* -Delete comments mapping from post when deleting comment
* -Embedded comment show page in single post show page to look more user friendly
* -Changed comment post and put routes to redirect back to single post show page
* -Used Google Fonts instead default fonts
* -Used momentJS to show post and comment creation and update timestamp

## Future Scope -
* Filtering Images/Texts, removing explicit content - Admin roles
* User email validation & security check
* Uploading images from local too
* Adding bold, italics, underline, highlight in Texts
* Improved Profile page with profile picture, description, followers, etc.
* Search bar - Search by post keywords/hashtags etc.
* Followers and following concept
* Comments/Posts like button counter
