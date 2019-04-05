const path = require('path')
const _ = require('lodash')
let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development'
let postNodes = []

function siblingFields(node) {
  return node && _.get(node, 'fields.permalink')
    ? {
        path: node.fields.permalink,
        title: _.get(node, 'frontmatter.title', '[undefined]'),
        excerpt: _.get(node, 'excerpt'),
        timeToRead: _.get(node, 'timeToRead'),
      }
    : {
        path: null,
        title: null,
        excerpt: null,
        timeToRead: null,
      }
}

//This is happening too frequently
function addSibilingNodes(actions) {
  const { createNodeField } = actions
  postNodes = postNodes.sort((nodeA, nodeB) => {
    let nodeADate = new Date(
      _.get(nodeA, 'frontmatter.date', _.get(nodeA, 'fields.createdDate', 0))
    )
    let nodeBDate = new Date(
      _.get(nodeB, 'frontmatter.date', _.get(nodeA, 'fields.createdDate', 0))
    )
    return nodeADate - nodeBDate
  })
  console.log('addSiblingNodes', postNodes.length)
  for (let i = 0; i < postNodes.length; i += 1) {
    console.log('inFor i', i)
    const currNode = postNodes[i]
    console.log(currNode.fields)
    // const nextID = i + 1 < postNodes.length ? i + 1 : 0
    const nextID = i + 1 < postNodes.length ? i + 1 : -1
    // const prevID = i - 1 >= 0 ? i - 1 : postNodes.length - 1
    const prevID = i - 1 >= 0 ? i - 1 : -1
    const nextNode = nextID === -1 ? null : postNodes[nextID]
    const prevNode = prevID === -1 ? null : postNodes[prevID]

    createNodeField({
      node: currNode,
      name: 'siblings',
      // value: prevNode.fields.permalink,
      value: {
        prev: siblingFields(prevNode),
        next: siblingFields(nextNode),
      },
    })
  }
}

//Check the path of the provided fileNode against the privaate paths
function nodeIsPrivate(node) {
  let isPrivate = false
  //Check frontmatter
  if (node.frontmatter) {
    if (
      node.frontmatter.private ||
      node.frontmatter.draft ||
      node.fields.isPostPrivate ||
      node.fields.private
    ) {
      isPrivate = true
    }
  }
  //Check paths
  const privatePaths = ['/content/draft', '/content/private']
  const dir = node.fileAbsolutePath
  if (dir) {
    isPrivate = privatePaths.reduce((accumulator, path) => {
      return accumulator || dir.indexOf(path) > -1
    }, isPrivate)
  }
  //Return is private
  return isPrivate
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { deleteNode, createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const private = nodeIsPrivate(node)

    const fileNode = getNode(node.parent)

    let createdDate = new Date(fileNode.birthTime)
    let modifiedDate = new Date(fileNode.changeTime || fileNode.birthTime)
    let slug = _.kebabCase(
      _.get(node, 'frontmatter.slug', _.get(node, 'frontmatter.title'))
    )

    if (!slug || slug === '') {
      slug = `${createdDate.getFullYear()}-${createdDate.getMonth()}-${createdDate.getDate()}--${
        fileNode.name
      }`
    }

    let prefix = _.get(node, 'frontmatter.type')
      ? `/${_.kebabCase(node.frontmatter.type)}/`
      : '/'

    let permalink = prefix + slug

    //if they've provided an explicit path, we'll use that
    permalink = _.get(node, 'frontmatter.path', permalink)

    createNodeField({ node, name: 'test', value: 'yes' })
    createNodeField({ node, name: 'permalink', value: permalink })
    createNodeField({ node, name: 'isPostPrivate', value: private })
    createNodeField({
      node,
      name: 'publishPost',
      value: !private || activeEnv === 'development',
    })

    //Add information about modified date
    createNodeField({
      node,
      name: 'createdDate',
      value: createdDate.toISOString(),
    })
    createNodeField({
      node,
      name: 'modifiedDate',
      value: modifiedDate.toISOString(),
    })
    createNodeField({
      node,
      name: 'siblings',
      value: {
        prev: { title: null, path: null },
        next: { title: null, path: null },
      },
    })
    createNodeField({
      node,
      name: 'test2',
      value: { a: 'b' },
    })
    // const parsedFilePath = path.parse(fileNode.relativePath)

    if (!private || activeEnv === 'development') {
      postNodes.push(node)
      //This will be done every time
      // addSibilingNodes(actions)
    } else {
    }
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              tags
            }
            fields {
              private
              permalink
              publishPost
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    let tags = []

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const permalink = _.get(node, 'fields.permalink')

      //create page
      if (permalink) {
        const private = nodeIsPrivate(node)
        //add tags
        if (_.get(node, 'frontmatter.tags')) {
          tags = tags.concat(node.frontmatter.tags)
        }
        if (!private || activeEnv === 'development') {
          const blogPostTemplate = path.resolve(`src/templates/post.js`)
          console.log(node.fields)
          createPage({
            path: permalink,
            component: blogPostTemplate,
            context: {
              permalink,
            }, // additional data can be passed via context
          })
        } else {
          // console.log('node is private! ... skipping')
        }
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    //create tag pages
    const tagTemplate = path.resolve(`src/templates/topic.js`)
    tags.forEach(tag => {
      createPage({
        path: `/topics/${_.kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })
  })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  return new Promise(resolve => {
    resolve()
  })
}
