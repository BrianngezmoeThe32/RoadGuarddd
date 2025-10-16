import ApiService from './api';

class ProviderService {
  static async getNearbyProviders(latitude, longitude, radius = 20, serviceType = null) {
    try {
      // This is a simplified version - you'll need geoqueries for exact implementation
      const conditions = [
        { field: 'isActive', operator: '==', value: true },
        { field: 'isVerified', operator: '==', value: true }
      ];
      
      if (serviceType) {
        conditions.push({ field: 'services', operator: 'array-contains', value: serviceType });
      }

      const providers = await ApiService.getCollection('providers', conditions);
      
      // For now, return mock data - you'll implement actual location filtering later
      return this.getMockProviders();
      
    } catch (error) {
      console.error('Error getting nearby providers:', error);
      return this.getMockProviders();
    }
  }

  static getMockProviders() {
    // Mock data for development
    return [
      {
        id: '1',
        name: 'Quick Assist Roadside',
        rating: 4.8,
        services: ['tire-change', 'jump-start'],
        estimatedArrival: '15-20 min',
        distance: '2.3 km'
      },
      {
        id: '2',
        name: 'Emergency Road Help',
        rating: 4.6,
        services: ['fuel-delivery', 'towing', 'lockout'],
        estimatedArrival: '10-15 min', 
        distance: '1.8 km'
      }
    ];
  }

  static async getProviderById(providerId) {
    try {
      return await ApiService.getDocument('providers', providerId);
    } catch (error) {
      console.error('Error getting provider:', error);
      throw error;
    }
  }
}

export default ProviderService;