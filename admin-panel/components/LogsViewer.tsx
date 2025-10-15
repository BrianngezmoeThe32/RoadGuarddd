import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SystemLog } from '../types/admin';
import { AdminService } from '../services/adminService';

export const LogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, selectedAction]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const logsData = await AdminService.getSystemLogs(200);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load logs:', error);
      Alert.alert('Error', 'Failed to load system logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLogs();
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by action type
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    setFilteredLogs(filtered);
  };

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getActionColor = (action: string) => {
    const actionColors: { [key: string]: string } = {
      'USER_LOGIN': '#4CAF50',
      'USER_LOGOUT': '#FF9800',
      'USER_REGISTER': '#2196F3',
      'SERVICE_REQUEST': '#9C27B0',
      'PROFILE_UPDATE': '#607D8B',
      'ERROR': '#F44336',
      'ADMIN_ACTION': '#FF5722',
    };
    return actionColors[action] || '#666';
  };

  const getActionIcon = (action: string) => {
    const actionIcons: { [key: string]: string } = {
      'USER_LOGIN': 'log-in',
      'USER_LOGOUT': 'log-out',
      'USER_REGISTER': 'person-add',
      'SERVICE_REQUEST': 'construct',
      'PROFILE_UPDATE': 'create',
      'ERROR': 'warning',
      'ADMIN_ACTION': 'shield',
    };
    return actionIcons[action] || 'document';
  };

  const getUniqueActions = () => {
    const actions = Array.from(new Set(logs.map(log => log.action)));
    return ['all', ...actions];
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderLogItem = ({ item }: { item: SystemLog }) => {
    const isExpanded = expandedLogs.has(item.id);
    const actionColor = getActionColor(item.action);
    const actionIcon = getActionIcon(item.action);

    return (
      <TouchableOpacity
        style={styles.logCard}
        onPress={() => toggleLogExpansion(item.id)}
      >
        <View style={styles.logHeader}>
          <View style={styles.logMainInfo}>
            <View style={[styles.actionBadge, { backgroundColor: actionColor }]}>
              <Ionicons name={actionIcon as any} size={12} color="#fff" />
              <Text style={styles.actionText}>{item.action}</Text>
            </View>
            <Text style={styles.userName}>{item.userName}</Text>
          </View>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>

        <View style={styles.logDetails}>
          <Text style={styles.userId}>User ID: {item.userId}</Text>
          {item.ipAddress && (
            <Text style={styles.ipAddress}>IP: {item.ipAddress}</Text>
          )}
        </View>

        {isExpanded && item.details && (
          <View style={styles.expandedDetails}>
            <Text style={styles.detailsLabel}>Details:</Text>
            <Text style={styles.detailsText}>
              {typeof item.details === 'string' 
                ? item.details 
                : JSON.stringify(item.details, null, 2)
              }
            </Text>
          </View>
        )}

        <View style={styles.expandIndicator}>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#666"
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading system logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Logs</Text>

      {/* Search and Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search logs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.actionFilter}>
          <Text style={styles.filterLabel}>Filter by action:</Text>
          <FlatList
            horizontal
            data={getUniqueActions()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedAction === item && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedAction(item)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedAction === item && styles.filterButtonTextActive,
                  ]}
                >
                  {item === 'all' ? 'All Actions' : item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>
      </View>

      {/* Logs Count */}
      <View style={styles.logsCount}>
        <Text style={styles.logsCountText}>
          Showing {filteredLogs.length} of {logs.length} logs
        </Text>
        <TouchableOpacity onPress={loadLogs} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Logs List */}
      <FlatList
        data={filteredLogs}
        renderItem={renderLogItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No logs found</Text>
            <Text style={styles.emptySubtext}>
              {logs.length === 0 
                ? 'No system logs available' 
                : 'Try adjusting your search or filters'
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  actionFilter: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterList: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  logsCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  logsCountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 4,
  },
  logCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  logMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    gap: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  logDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  userId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  ipAddress: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  expandedDetails: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});