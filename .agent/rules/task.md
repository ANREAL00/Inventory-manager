---
trigger: always_on
---

There are no limitations in the area of architecture or used services. For example, you are not required to have a separate full-featured application server separated from Web server, or have a lot of things on the client, or use microservices, etc.; you may approach this whatever way you want. 
It's recommended to use the simplest and the safest approach to the persistence, namely relational databse, e.g. PostgreSQL, MySQL, SQL Server, anything, but again you don't have to, you may try to use MongoDB or something (for this task it's definitely not the best idea, meh...). Again, you may replace Bootstrap with any CSS framework and/or UI library you like. 
React is required for JavaScript group; it can be used by .NET group as well.
You have to implement a Web application for inventory management (office equipment, books in library, documents in HR department, etc.). Users define arbitrary "inventories" (the set of fields with a title and description, etc.), and other users fill inventories with "items"  (specific ) using these templates (e.g., enter or select values in the fields). Two the most important features are custom inventory numbers (IDs) and custom fields.
E.g., I create an inventory with a string-valued field "Model" and a number-valued field "Price". Other users add their laptops to this inventory.
If your app will have N buttons (view/edit/delete in each item), your result will be graded -20%. Use toolbars, or animated "appearing" context actions, etc.
You have to use table representation for items and inventories, no gallery or tiles.
Every page provides access to full-text search via the top header. 
Inventories, as well as items, should be displayed in table views by default. You may add other display options, but do not replace the tables. 
Non-authenticated users cannot create inventories, leave comments or likes, or add items. However, they can use the search function and view all inventories and items in read-only mode.
The admin page allows user management, including: viewing, blocking, unblocking, deleting users, adding users to the admin role, and removing them from it.
Important: AN ADMIN CAN REMOVE ADMIN ACCESS FROM THEMSELVES.
Admins have full access and can view all pages as if they were the creator. For example, an admin can open another user's inventory and add fields or edit items—effectively acting as the owner of every inventory.
Only the creators (and admins) can edit their inventories (e.g., add/edit/delete fields, manage access, etc.). Creators define which users have write access (add/edit/delete) to their inventory. Creators can also mark an inventory as public, granting write access to all authenticated users.
Items in an inventory can be modified by the creator (and admins), and any users with write access (or by all authenticated users if the inventory is public).
All items are viewable by everyone, regardless of authentication status.
Users can register and authenticate via social netowrk (at least two; Google and Facebook are  very good options).
Every user has their own personal page, where they can manage two sortable/filterable tables:
A table of inventories they own (with options to create new, delete, or edit).
A table of inventories they have write access to.
Each inventory in the table functions as a link to its dedicated page, which contains several tabs:
Table of items in the inventory (with links to individual item pages).
Discusison section.
General settings — title, description, etc.
Custom inventory numbers.
Access settings — either all authenticated users (for public inventories) or specific users (for non-public ones).
Editable set of fields for all items in the inventory.
Inventory statistics/aggregation, such as the number of items, averages and ranges for numeric fields, most frequently used values for string fields, etc. The owner doesn't edit anything on this tab.
For users with write access (but not ownership), only the 1st and 2nd tabs are accessible in edit mode (items).
The inventory author and users with write access can:
Click any item to open it in edit mode.
Delete existing items.
Add new items.
Users without write access can only view items; they cannot add, edit, or delete them.
Access is managed by maintaining a list of users, with the ability to remove users from the list and add new ones by typing a username or email address (autocomplete is required both by name and e-mail). The list is sortable, with a user-switchable sort mode (by name or by email).
Inventory page supports auto-save capability (it's not required for items). Don't try to save every user keystroke; instead, track changes and save every 7–10 seconds. Beware of optimistic locking—each save operation either updates a version in the database and returns it for the next save, or fails.
Inventory settings include the following:
Title.
Description (supports Markdown formatting).
Category — a single value selected from a predefined list, e.g., Equipment, Furniture, Book, or Other (Note: new values are added directly in the database; no UI is required for this).
Optional image/illustration — uploaded by the user to the cloud.
Tags — users can enter multiple tags. Autocomplettion for tags is required: when the user starts typing, a dropdown should appear with existing tags from the database that start with the entered text.
Each inventory can be marked as public (allowing any authenticated user to add items), or the creator can manually select a list of registered users who are granted access.
The __first "killer-feature" is that an inventory allows the specification of custom fields for its items__.
In addition to the globally unique internal ID (not displayed in the UI), each inventory can define its own custom ID format, which generates a unique ID specific to that inventory. This format is customizable.
Custom IDs are unique within the scope of a single inventory. Items in different inventories may have the same custom ID.
Uniqueness is enforced at the database level—it's not possible to insert or update an item with a duplicate ID within the same inventory.
The custom ID is not the primary key (unique for the whole table and permanent) in the `[items]` table, but is instead managed by a separate composite database index (`inventory_id` plus `custom_id`).
Custom IDs are editable. On the item form, the ID is edited as a single string using one input field, with format validation applied.
When an item is created, the custom ID is generated by the system and saved to the database. If the custom ID format is later changed for the inventory, existing item IDs remain unchanged; however, during item editing, the new ID format rules are enforced.
The Custom ID tab includes a real-time example preview of the resulting ID.
The following ID parts (elements) are supported:
Fixed text (with full Unicode support),
20-bit random number,
32-bit random number,
6-digit random number,
9-digit random number,
GUID,
Date/time (at the moment of item creation),
Sequence (value equal to the largest existing sequence number +1 at the moment of item creation).
Users can:
Reorder ID elements via drag-and-drop.
Remove elements by dragging them outside the form.
Add new elements, with a recommended upper limit of at least 10 elements.
Change element formatting rules, e.g., format numbers with leading zeros.
The form should include detailed help, using popovers, to guide users through formatting options.
Of course, conflicts can occur during item submission when an item is created or edited (e.g., multiple users add items in parallel, a randomly generated value is duplicated, etc.). In such cases, the database should reject the items, and the user will need to manually edit the custom ID value.
The __second "killer-feature" is that an inventory allows the specification of custom fields for its items__.
There are also fixed fields that are always present. These fields are not visible in the UI for field customization but are displayed on every item form. For example, automatically generated fields like `created_by`, `created_at`, or `custom_id`—the latter being editable despite its automatic generation.
In addition to the fixed fields, it's possible to add custom fields, with the following limitations:
Up to 3 single-line text fields.
Up to 3 multi-line text fields.
Up to 3 numeric fields.
Up to 3 document/image fields (entered as a link).
Up to 3 true/false fields (displayed as checkboxes).
Each custom field includes:
Title.
Description (displayed as a tooltip or hint in forms).
A boolean flag indicating whether the field should be displayed in the item table view (on the inventory's tab).
Fields can be reordered via drag-and-drop.
For example, suppose I want to create an inventory for books in a library. I might add the following fields:
Single-line field: "Title"
Single-line field: "Authors"
Numeric field: "Year"
Multi-line field: "Annotation"
The main page of the app contains:
A table of the latest inventories, showing the name, description (or image), and creator.
A table of the top 5 most popular inventories, based on the number of items.
A tag cloud — when a user clicks a tag, a list of related inventories is displayed (you should reuse the standard “search results” page layout for that)
Each inventory page includes a discussion tab. Posts are linear—new posts are always added to the end; inserting posts between existing ones is not allowed. Posts should be updated automatically—when someone adds a post, it should appear for all users viewing the page within 2–5 seconds (real-time or near real-time updates). Every post displays Markdown text, user name (which works as a link to the user's personal page), and a date/time.
Each item has a "like" feature (a user can give one like per item, and no more than one like from the same user is allowed).
You need to implement optimistic locking for inventories (which can be modified simultaneously by the creator and admins) and for items (which are modifiable by multiple users with write access at the same time).
The application should support two UI languages: English and one additional language (e.g., Polish, Spanish, Uzbek, Georgian, etc.). The user selects the language, and their choice is saved. _Only the UI is translated_ — user-generated content such as inventories or items is not translated.
The application should also support two visual themes: light and dark. The user selects the theme, and their choice is saved.
Requirements:
Use a CSS framework (e.g., Bootstrap — or any other framework and set of UI controls you prefer).
Support responsive design for various screen sizes and resolutions, including mobile phones.
Use an ORM (e.g., Sequelize, Prisma, TypeORM, Entity Framework — any is acceptable).
Use a full-text search engine, either through an external library or native database features.
DON'Ts:
Don’t perform full database scans using raw SELECT * queries.
Don’t upload images to your web server or database.
Don’t execute database queries inside loops.
Don't add buttons in the table rows.
Please don't even think about using JSON to serialise items for storage (you can pass items in JSON from the client to the server, of course). It's a bad idea. You will need to edit inventories, and fields should be somehow preserved. E.g., it's possible to change the field title. Or remove the field. Of course, you shouldn't try to edit or "fix" items on the fly.
Think about this problem in this way: all the items for a given inventory should be "compatible," and you need to calculate aggregate values for them.
Also, don't even think about generating tables in the database on the fly. It's bad idea for several reasons. 
You need up to 3 fields of each type only. It means that you can consider the fields fixed and only manage whether they are shown and what titles are rendered. The relational database fits this task perfectly. It will work fast, and you won't get into trouble with "I don't know how to aggregate data from do