const Group = require('./model')

function createGroup (data) {
  return Group.create(data)
}

function updateGroup (group, updates) {
  Object.assign(group, updates)
  return group.save()
}

function updateGroupById (groupId, updates) {
  return Group.updateOne({ _id: groupId }, updates)
}

function findAllGroups () {
  return Group.find({})
}

function findGroupById (groupId, { fields } = {}) {
  return groupId && Group.findOne({ _id: groupId }).select(fields)
}

function findGroupsByUserId (userId, { fields } = {}) {
  return Group.find({ userIds: userId }).select(fields)
}

function findGroupByInviteId (userId, { fields } = {}) {
  return Group.find({ invitedUserIds: userId }).select(fields)
}

async function removeGroupById (groupId) {
  return Group.deleteOne({ _id: groupId })
}

module.exports = {
  createGroup,
  updateGroup,
  updateGroupById,
  findAllGroups,
  findGroupById,
  findGroupsByUserId,
  findGroupByInviteId,
  removeGroupById
}
