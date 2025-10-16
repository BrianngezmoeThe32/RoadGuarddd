import ApiService from './api';

class ServiceService {
  static async getAvailableServices() {
    try {
      // Get all active services from Firestore
      const services = await ApiService.getCollection(
        'services', 
        [{ field: 'isActive', operator: '==', value: true }],
        'name'
      );
      
      return services;
    } catch (error) {
      console.error('Error getting services:', error);
      // Return default services if Firestore fails
      return this.getDefaultServices();
    }
  }

  static getDefaultServices() {
    // Fallback services in case Firestore is not set up yet
    return [
      {
        id: '1',
        name: 'Tire Change',
        description: 'Flat tire replacement service',
        icon: '🛞',
        basePrice: 50,
        estimatedTime: 30,
        isActive: true
      },
      {
        id: '2', 
        name: 'Jump Start',
        description: 'Battery jump start service',
        icon: '🔋',
        basePrice: 30,
        estimatedTime: 15,
        isActive: true
      },
      {
        id: '3',
        name: 'Fuel Delivery',
        description: 'Emergency fuel delivery',
        icon: '⛽',
        basePrice: 40,
        estimatedTime: 25,
        isActive: true
      },
      {
        id: '4',
        name: 'Lockout Service',
        description: 'Car lockout assistance',
        icon: '🔑',
        basePrice: 60,
        estimatedTime: 20,
        isActive: true
      },
      {
        id: '5',
        name: 'Towing',
        description: 'Vehicle towing service',
        icon: '🚛',
        basePrice: 100,
        estimatedTime: 45,
        isActive: true
      }
    ];
  }

  static async getServiceById(serviceId) {
    try {
      return await ApiService.getDocument('services', serviceId);
    } catch (error) {
      console.error('Error getting service:', error);
      // Find in default services if not in Firestore
      const defaultServices = this.getDefaultServices();
      return defaultServices.find(service => service.id === serviceId);
    }
  }
}

export default ServiceService;