const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// GET /api/projects - Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET /api/projects/:id - Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// POST /api/projects - Create new project (admin only - will add auth later)
router.post('/', async (req, res) => {
  try {
    const { title, description, tech, liveUrl, githubUrl, imageUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      tech: tech || [],
      liveUrl: liveUrl?.trim(),
      githubUrl: githubUrl?.trim(),
      imageUrl: imageUrl?.trim()
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// PUT /api/projects/:id - Update project (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, tech, liveUrl, githubUrl, imageUrl } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.title = title?.trim() || project.title;
    project.description = description?.trim() || project.description;
    project.tech = tech || project.tech;
    project.liveUrl = liveUrl?.trim() || project.liveUrl;
    project.githubUrl = githubUrl?.trim() || project.githubUrl;
    project.imageUrl = imageUrl?.trim() || project.imageUrl;

    await project.save();

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// DELETE /api/projects/:id - Delete project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;