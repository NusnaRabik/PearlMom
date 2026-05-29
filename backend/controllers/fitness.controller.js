const { Exercise, ExerciseProgress, Mother } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

// @desc    Get exercises by trimester
// @route   GET /api/fitness/exercises/:trimester
const getExercisesByTrimester = async (req, res) => {
    try {
        const { trimester } = req.params;
        const exercises = await Exercise.findAll({
            where: { trimester, is_active: true },
            order: [['display_order', 'ASC']]
        });
        return successResponse(res, { exercises });
    } catch (error) {
        console.error('Error fetching exercises:', error);
        return errorResponse(res, 'Failed to fetch exercises');
    }
};

// @desc    Get today's exercises for mother
// @route   GET /api/fitness/today
const getTodayExercises = async (req, res) => {
    try {
        const mother = await Mother.findOne({
            where: { user_id: req.user.user_id, is_deleted: false }
        });

        if (!mother) {
            return errorResponse(res, 'Mother profile not found', 404);
        }

        const weeks = mother.weeks || 0;
        let trimester = 'first';
        if (weeks >= 13 && weeks <= 26) trimester = 'second';
        if (weeks >= 27) trimester = 'third';

        const exercises = await Exercise.findAll({
            where: { trimester, is_active: true },
            order: [['display_order', 'ASC']]
        });

        const today = new Date().toISOString().split('T')[0];
        
        // Get completed exercises for today
        const completedProgress = await ExerciseProgress.findAll({
            where: {
                mother_id: mother.mother_id,
                completed_date: today
            }
        });

        const completedIds = new Set(completedProgress.map(p => p.exercise_id));
        
        const exercisesWithStatus = exercises.map(exercise => ({
            ...exercise.toJSON(),
            isCompleted: completedIds.has(exercise.exercise_id),
            progressId: completedProgress.find(p => p.exercise_id === exercise.exercise_id)?.progress_id
        }));

        const completedCount = exercisesWithStatus.filter(e => e.isCompleted).length;
        const totalCount = exercisesWithStatus.length;
        const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        return successResponse(res, {
            trimester,
            weeks,
            exercises: exercisesWithStatus,
            stats: {
                completed: completedCount,
                total: totalCount,
                percentage: Math.round(progressPercentage)
            }
        });

    } catch (error) {
        console.error('Error fetching today\'s exercises:', error);
        return errorResponse(res, 'Failed to fetch exercises');
    }
};

// @desc    Mark exercise as completed
// @route   POST /api/fitness/complete
const completeExercise = async (req, res) => {
    try {
        const { exercise_id, duration_minutes, notes } = req.body;

        const mother = await Mother.findOne({
            where: { user_id: req.user.user_id, is_deleted: false }
        });

        if (!mother) {
            return errorResponse(res, 'Mother profile not found', 404);
        }

        const today = new Date().toISOString().split('T')[0];

        const [progress, created] = await ExerciseProgress.findOrCreate({
            where: {
                mother_id: mother.mother_id,
                exercise_id: exercise_id,
                completed_date: today
            },
            defaults: {
                duration_minutes: duration_minutes || 15,
                notes: notes || '',
                status: 'completed'
            }
        });

        if (!created) {
            await progress.update({
                status: 'completed',
                duration_minutes: duration_minutes || progress.duration_minutes,
                notes: notes || progress.notes
            });
        }

        return successResponse(res, { progress }, 'Exercise marked as completed');

    } catch (error) {
        console.error('Error completing exercise:', error);
        return errorResponse(res, 'Failed to mark exercise');
    }
};

// @desc    Get exercise history
// @route   GET /api/fitness/history
const getExerciseHistory = async (req, res) => {
    try {
        const mother = await Mother.findOne({
            where: { user_id: req.user.user_id, is_deleted: false }
        });

        if (!mother) {
            return errorResponse(res, 'Mother profile not found', 404);
        }

        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const history = await ExerciseProgress.findAll({
            where: {
                mother_id: mother.mother_id,
                completed_date: { [Op.gte]: startDate }
            },
            include: [{ model: Exercise, attributes: ['exercise_name', 'category', 'trimester'] }],
            order: [['completed_date', 'DESC']]
        });

        return successResponse(res, { history });

    } catch (error) {
        console.error('Error fetching history:', error);
        return errorResponse(res, 'Failed to fetch history');
    }
};

// @desc    Get weekly summary
// @route   GET /api/fitness/summary
const getWeeklySummary = async (req, res) => {
    try {
        const mother = await Mother.findOne({
            where: { user_id: req.user.user_id, is_deleted: false }
        });

        if (!mother) {
            return errorResponse(res, 'Mother profile not found', 404);
        }

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyProgress = await ExerciseProgress.findAll({
            where: {
                mother_id: mother.mother_id,
                completed_date: { [Op.gte]: startOfWeek }
            },
            attributes: [
                'completed_date',
                [sequelize.fn('COUNT', sequelize.col('progress_id')), 'count']
            ],
            group: ['completed_date']
        });

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const summary = daysOfWeek.map((day, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const dateStr = date.toISOString().split('T')[0];
            const progress = weeklyProgress.find(p => p.completed_date === dateStr);
            return {
                day,
                date: dateStr,
                completed: progress ? parseInt(progress.dataValues.count) : 0
            };
        });

        return successResponse(res, { summary });

    } catch (error) {
        console.error('Error fetching weekly summary:', error);
        return errorResponse(res, 'Failed to fetch summary');
    }
};

module.exports = {
    getExercisesByTrimester,
    getTodayExercises,
    completeExercise,
    getExerciseHistory,
    getWeeklySummary
};