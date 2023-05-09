// Code generated by mockery v2.23.2. DO NOT EDIT.

// Regenerate this file using `make misc-mocks`.

package mocks

import (
	request "github.com/mattermost/mattermost-server/server/v8/channels/app/request"
	model "github.com/mattermost/mattermost-server/server/v8/public/model"
	mock "github.com/stretchr/testify/mock"

	worktemplates "github.com/mattermost/mattermost-server/server/v8/channels/app/worktemplates"
)

// WorkTemplateExecutor is an autogenerated mock type for the WorkTemplateExecutor type
type WorkTemplateExecutor struct {
	mock.Mock
}

// CreateBoard provides a mock function with given fields: c, wtcr, cBoard, linkToChannelID
func (_m *WorkTemplateExecutor) CreateBoard(c *request.Context, wtcr *worktemplates.ExecutionRequest, cBoard *model.WorkTemplateBoard, linkToChannelID string) (string, error) {
	ret := _m.Called(c, wtcr, cBoard, linkToChannelID)

	var r0 string
	var r1 error
	if rf, ok := ret.Get(0).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplateBoard, string) (string, error)); ok {
		return rf(c, wtcr, cBoard, linkToChannelID)
	}
	if rf, ok := ret.Get(0).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplateBoard, string) string); ok {
		r0 = rf(c, wtcr, cBoard, linkToChannelID)
	} else {
		r0 = ret.Get(0).(string)
	}

	if rf, ok := ret.Get(1).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplateBoard, string) error); ok {
		r1 = rf(c, wtcr, cBoard, linkToChannelID)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// CreateChannel provides a mock function with given fields: c, wtcr, cChannel
func (_m *WorkTemplateExecutor) CreateChannel(c *request.Context, wtcr *worktemplates.ExecutionRequest, cChannel *model.WorkTemplateChannel) (string, error) {
	ret := _m.Called(c, wtcr, cChannel)

	var r0 string
	var r1 error
	if rf, ok := ret.Get(0).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplateChannel) (string, error)); ok {
		return rf(c, wtcr, cChannel)
	}
	if rf, ok := ret.Get(0).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplateChannel) string); ok {
		r0 = rf(c, wtcr, cChannel)
	} else {
		r0 = ret.Get(0).(string)
	}

	if rf, ok := ret.Get(1).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplateChannel) error); ok {
		r1 = rf(c, wtcr, cChannel)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// CreatePlaybook provides a mock function with given fields: c, wtcr, playbook, channel
func (_m *WorkTemplateExecutor) CreatePlaybook(c *request.Context, wtcr *worktemplates.ExecutionRequest, playbook *model.WorkTemplatePlaybook, channel model.WorkTemplateChannel) (string, error) {
	ret := _m.Called(c, wtcr, playbook, channel)

	var r0 string
	var r1 error
	if rf, ok := ret.Get(0).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplatePlaybook, model.WorkTemplateChannel) (string, error)); ok {
		return rf(c, wtcr, playbook, channel)
	}
	if rf, ok := ret.Get(0).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplatePlaybook, model.WorkTemplateChannel) string); ok {
		r0 = rf(c, wtcr, playbook, channel)
	} else {
		r0 = ret.Get(0).(string)
	}

	if rf, ok := ret.Get(1).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplatePlaybook, model.WorkTemplateChannel) error); ok {
		r1 = rf(c, wtcr, playbook, channel)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// InstallPlugin provides a mock function with given fields: c, wtcr, cIntegration, sendToChannelID
func (_m *WorkTemplateExecutor) InstallPlugin(c *request.Context, wtcr *worktemplates.ExecutionRequest, cIntegration *model.WorkTemplateIntegration, sendToChannelID string) error {
	ret := _m.Called(c, wtcr, cIntegration, sendToChannelID)

	var r0 error
	if rf, ok := ret.Get(0).(func(*request.Context, *worktemplates.ExecutionRequest, *model.WorkTemplateIntegration, string) error); ok {
		r0 = rf(c, wtcr, cIntegration, sendToChannelID)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

type mockConstructorTestingTNewWorkTemplateExecutor interface {
	mock.TestingT
	Cleanup(func())
}

// NewWorkTemplateExecutor creates a new instance of WorkTemplateExecutor. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewWorkTemplateExecutor(t mockConstructorTestingTNewWorkTemplateExecutor) *WorkTemplateExecutor {
	mock := &WorkTemplateExecutor{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
