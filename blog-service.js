const Sequelize = require('sequelize');
var sequelize = new Sequelize('data1', 'Raman', 'Raman@123', {
    host: 'Raman',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
		ssl: { rejectUnauthorized: false }
			},
		query: { raw: true }
	});
formatDate: function(dateObj){
 let year = dateObj.getFullYear();
 let month = (dateObj.getMonth() + 1).toString();
 let day = dateObj.getDate().toString();
 return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
}
var Post = sequelize.define('Post', {
    postid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate : Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published : Sequelize.BOOLEAN,
	category:  Sequelize.STRING
	
})
var Category = sequelize.define('Category', {
    category : {
        categoryid: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
        
    }
	category: Sequelize.TEXT
	
})
Post.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize =function (){
     
      return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(() => {
                resolve("database synced");
            })
            .catch(() => {
                reject("unable to sync database");
            })
    });

} 
module.exports.getAllPosts = function(){
      return new Promise(function (resolve, reject) {
        Post.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            })
    });

};
module.exports.getPostsByCategory= function(category){
    return new Promise(function (resolve, reject) {
        Post.findAll({
            where: {
                category: category
            }
        })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned")
            })
    });
};
module.exports.getPostsByMinDate= function(minDateStr){
     return new Promise(function (resolve, reject) {
        Post.findAll({
           where: {
				postDate: {
				[gte]: new Date(minDateStr)
				}
				}

        })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned")
            })
    });
};
module.exports. getPostById= function(id){
   return new Promise(function (resolve, reject) {
        Post.findAll({
            where: {
                postid: id
            }
        })
            .then((data) => {
                resolve(data[0]); 
            })
            .catch(() => {
                reject("no results returned")
            })
    });
};
module.exports.addPost = function( postData ){

      return new Promise(function (resolve, reject) {
        
        postData.published = = (postData.published) ? true : false;
        // ensure all empty attributes are set to null
        for (var prop in postData) {
            if (postData[prop] == "") {
                postData[prop] = null;
            }
        }
		postData.postDate: new Date();
        Post.create({
            postid: postData.postid,
	        title: postData.title,
			postDate: postData.postDate,
			featureImage: postData.featureImage,
			published: postData.published,
			category: postData.category
			
             
        })
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("unable to create post")
            })
    });
}

 module.exports.getPublishedPosts= function(published1){
     return new Promise(function (resolve, reject) {
        Post.findAll({
            where: {
                published: published1
            }
        })
            .then((data) => {
                resolve(data); 
            })
            .catch(() => {
                reject("no results returned")
            })
    });
};
module.exports.getPublishedPostsByCategory= function(published1,category1){
     return new Promise(function (resolve, reject) {
        Post.findAll({
            where: {
                published: published1
				category: category1
            }
        })
            .then((data) => {
                resolve(data); 
            })
            .catch(() => {
                reject("no results returned")
            })
    });
};

module.exports.getCategories= function(){
     return new Promise(function (resolve, reject) {
        Post.findAll()
            .then((data) => {
                resolve(data); 
            })
            .catch(() => {
                reject("no results returned")
            })
    });
};

module.exports.addCategory = (categoryData) => {
    return new Promise(function (resolve, reject) {
        // ensure all empty attributes are set to null
        for (var prop in departmentData) {
            if (categoryData[prop] == "") {
				
                categoryData[prop] = null;
            }
        }
        Category..create({
			categoryid: category.categoryid,
            category: categorycategory
             
        })
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("unable to create category")
            })
    });
};

module.exports.deleteCategoryById = (id) => {
    return new Promise(function (resolve, reject) {
       Category.destroy({
           where: { categoryid: id }
       }).then(() => {
           resolve("Category #" + id + " has been deleted");
       }).catch(() => {
           reject("unable to delete catgory #" + num);
       })
    });
};

module.exports.deletePostById = (id) => {
    return new Promise(function (resolve, reject) {
       Category.destroy({
           where: { postid: id }
       }).then(() => {
           resolve("Post #" + id + " has been deleted");
       }).catch(() => {
           reject("unable to delete post #" + num);
       })
    });
};