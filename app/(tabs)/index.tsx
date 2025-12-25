import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Modal, Image as RNImage, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { DietService } from '../../src/services/dietService';
import { TrackingService } from '../../src/services/trackingService';
import { DailyPlan } from '../../src/types/diet';
import { NutritionCalculator } from '../../src/utils/nutritionCalculator';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, userProfile } = useAuth();

  const [dailyPlan, setDailyPlan] = useState<DailyPlan | undefined>(undefined);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    if (userProfile?.currentDietId) {
      loadDailyPlan(userProfile.currentDietId);
    }
  }, [userProfile]);

  const loadDailyPlan = async (dietId: string) => {
    setLoadingPlan(true);
    try {
      // Just fetching day 1 for now
      const plan = await DietService.getDailyPlan(dietId, 1);
      setDailyPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(false);
    }
  };

  // Stats state
  const [stats, setStats] = useState({
    calories: { current: 1250, target: 2000 },
    protein: { current: 80, target: 150 },
    carbs: { current: 150, target: 200 },
    fat: { current: 40, target: 70 },
    water: { current: 1.5, target: 2.5 },
    steps: { current: 5430, target: 10000 },
  });

  // Steps Modal State
  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [newSteps, setNewSteps] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [userProfile]) // Reload when profile changes
  );

  const loadStats = async () => {
    try {
      const data = await TrackingService.getDailyStats();

      // Calculate dynamic targets
      if (userProfile) {
        const waterTarget = NutritionCalculator.calculateWaterTarget(userProfile.weight);
        const dailyCalories = NutritionCalculator.calculateDailyCalories(userProfile);
        const macros = NutritionCalculator.calculateMacros(dailyCalories, userProfile.currentDietId || 'balanced');

        // Override mock targets with calculated ones
        // In a real app, you might save these to the DB first
        setStats({
          ...data,
          water: { ...data.water, target: waterTarget },
          calories: { ...data.calories, target: dailyCalories },
          protein: { ...data.protein, target: macros.protein },
          carbs: { ...data.carbs, target: macros.carbs },
          fat: { ...data.fat, target: macros.fat }
        });
      } else {
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSteps = async () => {
    if (!newSteps) return;
    try {
      const steps = parseInt(newSteps);
      if (!isNaN(steps)) {
        const updated = await TrackingService.updateSteps(steps);
        setStats(updated);
        setStepsModalVisible(false);
        setNewSteps('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const quickActions = [
    { id: 'log-food', icon: 'fast-food', label: t('home.logFood', 'Add Meal'), route: '/log-food' },
    { id: 'water', icon: 'water', label: t('home.addWater', 'Add Water'), route: '/water' },
    { id: 'activity', icon: 'fitness', label: t('home.workout', 'Workout'), route: '/workout' },
    { id: 'groups', icon: 'people', label: t('home.community', 'Groups'), route: '/(tabs)/groups' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={Colors.gradients.ocean}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>{t('home.hello', 'Hello')},</Text>
              <Text style={styles.userName}>
                {userProfile?.displayName || user?.displayName || 'Friend'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                style={styles.langButton}
                onPress={() => {
                  const nextLang = i18n.language === 'en' ? 'tr' : 'en';
                  i18n.changeLanguage(nextLang);
                }}
              >
                <Text style={styles.langText}>{i18n.language === 'en' ? 'TR' : 'EN'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person-circle-outline" size={36} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Simple Progress Ring Mockup */}
          <View style={styles.statsCard}>
            <View style={styles.mainStat}>
              <View style={styles.ringContainer}>
                <Ionicons name="flame" size={32} color={Colors.light.primary} />
                <Text style={styles.ringValue}>{stats.calories.current}</Text>
                <Text style={styles.ringLabel}>kcal</Text>
              </View>
              <View style={styles.statDetails}>
                <Text style={styles.targetText}>Target: {stats.calories.target}</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${Math.min(100, (stats.calories.current / stats.calories.target) * 100)}%` }]} />
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.miniStatsRow}>
              <TouchableOpacity style={styles.miniStat} onPress={() => router.push('/water')}>
                <Ionicons name="water-outline" size={20} color="#00a8ff" />
                <Text style={styles.miniStatValue}>{stats.water.current}L</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.miniStat} onPress={() => setStepsModalVisible(true)}>
                <Ionicons name="footsteps-outline" size={20} color="#ff9f43" />
                <Text style={styles.miniStatValue}>{stats.steps.current}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions', 'Quick Actions')}</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => {
                  if (action.id === 'water') {
                    router.push('/water');
                  } else if (action.route.startsWith('/(tabs)')) {
                    router.push(action.route as any);
                  } else {
                    // Placeholder for unimplemented routes
                    console.log('Navigate to', action.route);
                  }
                }}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon as any} size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nutrition Goals (Macros) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.nutritionGoals', 'Nutrition Goals')}</Text>
          <View style={styles.macroContainer}>
            {/* Protein */}
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{t('home.protein', 'Protein')}</Text>
                <Text style={styles.macroValue}>{stats.protein.current} / {stats.protein.target}g</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, (stats.protein.current / stats.protein.target) * 100)}%`, backgroundColor: '#FF6B6B' }]} />
              </View>
            </View>

            {/* Carbs */}
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{t('home.carbs', 'Carbs')}</Text>
                <Text style={styles.macroValue}>{stats.carbs.current} / {stats.carbs.target}g</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, (stats.carbs.current / stats.carbs.target) * 100)}%`, backgroundColor: '#4ECDC4' }]} />
              </View>
            </View>

            {/* Fat */}
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{t('home.fat', 'Fat')}</Text>
                <Text style={styles.macroValue}>{stats.fat.current} / {stats.fat.target}g</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, (stats.fat.current / stats.fat.target) * 100)}%`, backgroundColor: '#FFE66D' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Today's Plan */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={styles.sectionTitle}>{t('home.todaysPlan', "Today's Plan")}</Text>
            {userProfile?.currentDietId && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile?screen=diet-preferences')}>
                <Text style={{ color: Colors.light.primary }}>Change</Text>
              </TouchableOpacity>
            )}
          </View>

          {!userProfile?.currentDietId ? (
            <View style={styles.emptyState}>
              <Text style={{ color: '#ccc', marginBottom: 10 }}>No diet selected yet.</Text>
              <TouchableOpacity
                style={styles.selectDietButton}
                onPress={() => router.push('/profile/diet-preferences')}
              >
                <Text style={styles.selectDietText}>Select a Diet Program</Text>
              </TouchableOpacity>
            </View>
          ) : dailyPlan ? (
            dailyPlan.meals.map((meal, index) => (
              <View key={index} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealType}>{meal.type.toUpperCase()}</Text>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>
                <View style={styles.mealContent}>
                  {meal.image ? (
                    <RNImage source={{ uri: meal.image }} style={styles.mealImage} />
                  ) : (
                    <View style={styles.mealImagePlaceholder}>
                      <Ionicons name="restaurant" size={20} color="#666" />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.macros}>P: {meal.protein}g  C: {meal.carbs}g  F: {meal.fat}g</Text>
                  </View>
                  <TouchableOpacity style={styles.checkButton}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: '#ccc' }}>Loading plan...</Text>
          )}
        </View>

        {/* Featured Content / Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.dailyTips', 'Daily Tips')}</Text>
          <TouchableOpacity style={styles.tipCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.tipGradient}
            >
              <Ionicons name="nutrition-outline" size={28} color="#FF6B6B" style={{ marginBottom: 10 }} />
              <Text style={styles.tipTitle}>Eat more fiber</Text>
              <Text style={styles.tipDescription}>
                Fiber helps you feel full longer. Try adding chia seeds to your breakfast.
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tipCard, { marginTop: 15 }]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.tipGradient}
            >
              <Ionicons name="moon-outline" size={28} color="#5f27cd" style={{ marginBottom: 10 }} />
              <Text style={styles.tipTitle}>Sleep Well</Text>
              <Text style={styles.tipDescription}>
                Good sleep is crucial for weight loss and recovery. Aim for 7-8 hours.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Steps Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stepsModalVisible}
        onRequestClose={() => setStepsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStepsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Steps</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter steps count"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={newSteps}
                  onChangeText={setNewSteps}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setStepsModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleUpdateSteps}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 5,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  langText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mainStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  ringValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  ringLabel: {
    fontSize: 10,
    color: '#ccc',
  },
  statDetails: {
    flex: 1,
    marginLeft: 20,
  },
  targetText: {
    color: '#ccc',
    marginBottom: 8,
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 15,
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniStatValue: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 157, 143, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tipCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  tipGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  mealCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mealType: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  mealCalories: {
    color: '#ccc',
    fontSize: 12,
  },
  mealContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  mealImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  macros: {
    color: '#888',
    fontSize: 12,
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(42, 157, 143, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  emptyState: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  selectDietButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectDietText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#334155',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButtonText: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  macroContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  macroRow: {
    marginBottom: 15,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  macroValue: {
    color: '#ccc',
    fontSize: 12,
  },
});
