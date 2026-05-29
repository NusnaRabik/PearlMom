import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle2, Circle, Play, Video, 
  TrendingUp, Award, Flame, Heart, Calendar as CalendarIcon,
  ChevronRight, X, Loader, AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import ChatWidget from '../../components/common/ChatWidget';

const FitnessGuidePage = () => {
  const [loading, setLoading] = useState(true);
  const [todayData, setTodayData] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [completingExercise, setCompletingExercise] = useState(null);

  const trimesterInfo = {
    first: { name: 'First Trimester', weeks: '1-12 weeks', color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    second: { name: 'Second Trimester', weeks: '13-26 weeks', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    third: { name: 'Third Trimester', weeks: '27-40 weeks', color: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' }
  };

  useEffect(() => {
    fetchTodayExercises();
    fetchWeeklySummary();
    fetchHistory();
  }, []);

  const fetchTodayExercises = async () => {
    try {
      const response = await api.get('/fitness/today');
      if (response.data.success) {
        setTodayData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching today\'s exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklySummary = async () => {
    try {
      const response = await api.get('/fitness/summary');
      if (response.data.success) {
        setWeeklySummary(response.data.data.summary);
      }
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/fitness/history');
      if (response.data.success) {
        setHistory(response.data.data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleCompleteExercise = async (exercise) => {
    setCompletingExercise(exercise.exercise_id);
    try {
      await api.post('/fitness/complete', {
        exercise_id: exercise.exercise_id,
        duration_minutes: exercise.duration_minutes
      });
      await fetchTodayExercises();
      await fetchWeeklySummary();
      await fetchHistory();
    } catch (error) {
      console.error('Error completing exercise:', error);
      alert('Failed to mark exercise as completed. Please try again.');
    } finally {
      setCompletingExercise(null);
    }
  };

  const handlePlayVideo = (exercise) => {
    setSelectedVideo(exercise);
    setShowVideoModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your fitness guide...</p>
        </div>
      </div>
    );
  }

  const currentTrimesterInfo = trimesterInfo[todayData?.trimester] || trimesterInfo.first;
  const stats = todayData?.stats || { completed: 0, total: 0, percentage: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fitness Guide</h1>
        <p className="text-gray-500">Safe prenatal exercises tailored for your pregnancy journey</p>
      </div>

      {/* Trimester Banner */}
      <div className={`rounded-2xl p-6 ${currentTrimesterInfo.bg} border ${currentTrimesterInfo.border}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Badge className={`${currentTrimesterInfo.bg} ${currentTrimesterInfo.text} border-none`}>
              Current Trimester
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{currentTrimesterInfo.name}</h2>
            <p className="text-gray-600">Week {todayData?.weeks || 'N/A'} • {currentTrimesterInfo.weeks}</p>
          </div>
          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="42" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle 
                  cx="48" cy="48" r="42" fill="none" 
                  stroke={currentTrimesterInfo.color === 'green' ? '#10b981' : currentTrimesterInfo.color === 'blue' ? '#3b82f6' : '#8b5cf6'} 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.percentage / 100) * 263.89} 263.89`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{stats.percentage}%</span>
                <span className="text-[10px] text-gray-500">Complete</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{stats.completed}/{stats.total} exercises</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Exercises */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Today's Exercises</h3>
                  <p className="text-sm text-gray-500">Complete these exercises for a healthy pregnancy</p>
                </div>
                <Badge className="bg-pink-100 text-pink-700 border-none">
                  {formatDate(new Date(), 'long')}
                </Badge>
              </div>

              <div className="space-y-4">
                {todayData?.exercises?.map((exercise) => (
                  <div 
                    key={exercise.exercise_id}
                    className={`rounded-xl p-4 border transition-all ${
                      exercise.isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {exercise.isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-300" />
                          )}
                          <h4 className="font-bold text-gray-900">{exercise.exercise_name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {exercise.duration_minutes} min
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 ml-9">{exercise.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3 ml-9">
                          <span className="text-xs text-gray-400">Difficulty: {exercise.difficulty}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">Category: {exercise.category}</span>
                        </div>
                        {exercise.tips && (
                          <p className="text-xs text-amber-600 mt-2 ml-9">💡 Tip: {exercise.tips}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        {exercise.video_url && (
                          <button
                            onClick={() => handlePlayVideo(exercise)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Play className="h-4 w-4" />
                            Watch Video
                          </button>
                        )}
                        {!exercise.isCompleted && (
                          <button
                            onClick={() => handleCompleteExercise(exercise)}
                            disabled={completingExercise === exercise.exercise_id}
                            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
                          >
                            {completingExercise === exercise.exercise_id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            Mark Completed
                          </button>
                        )}
                        {exercise.isCompleted && (
                          <span className="text-center text-sm text-green-600 font-medium">
                            ✓ Completed Today
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!todayData?.exercises || todayData.exercises.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No exercises found for your trimester</p>
                    <p className="text-xs mt-1">Please check back later</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress & History */}
        <div className="space-y-6">
          {/* Weekly Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-pink-500" />
                <h3 className="font-bold text-gray-900">This Week's Progress</h3>
              </div>
              <div className="space-y-3">
                {weeklySummary.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        day.completed > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {day.completed > 0 ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-20">{day.day}</span>
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((day.completed / 4) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{day.completed}/4</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.slice(0, 3).map((item) => (
                  <div key={item.progress_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.Exercise?.exercise_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.completed_date, 'long')}</p>
                    </div>
                    <Badge variant="success" className="text-[10px]">Completed</Badge>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>No exercise history yet</p>
                    <p className="text-xs mt-1">Complete your first exercise to see progress!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Motivation Tip */}
          <Card>
            <CardContent className="p-6 bg-gradient-to-r from-pink-50 to-rose-50">
              <div className="flex items-start gap-3">
                <Award className="h-8 w-8 text-pink-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Daily Motivation</h4>
                  <p className="text-sm text-gray-600">
                    Regular exercise during pregnancy can reduce back pain, improve sleep, and prepare your body for labor. Keep going, mama! 💪
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-pink-300 transition-colors flex items-center space-x-1"
            >
              <X size={20} />
              <span className="text-sm">Close</span>
            </button>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={selectedVideo.video_url?.replace('youtu.be/', 'youtube.com/embed/')?.replace('watch?v=', 'embed/') + '?autoplay=1&rel=0'}
                title={selectedVideo.exercise_name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-white text-center text-sm mt-3 font-medium">{selectedVideo.exercise_name}</p>
          </div>
        </div>
      )}
      <ChatWidget />
    </div>
  );
};

export default FitnessGuidePage;