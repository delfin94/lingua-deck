
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/app/integrations/supabase/client';

interface DiagnosticInfo {
  asyncStorageWorking: boolean;
  supabaseConnected: boolean;
  edgeFunctionWorking: boolean;
  networkConnected: boolean;
  errorLogs: string[];
}

export default function AppDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo>({
    asyncStorageWorking: false,
    supabaseConnected: false,
    edgeFunctionWorking: false,
    networkConnected: false,
    errorLogs: [],
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results: DiagnosticInfo = {
      asyncStorageWorking: false,
      supabaseConnected: false,
      edgeFunctionWorking: false,
      networkConnected: false,
      errorLogs: [],
    };

    // Test AsyncStorage
    try {
      await AsyncStorage.setItem('test_key', 'test_value');
      const value = await AsyncStorage.getItem('test_key');
      results.asyncStorageWorking = value === 'test_value';
      await AsyncStorage.removeItem('test_key');
    } catch (error) {
      results.errorLogs.push(`AsyncStorage error: ${error}`);
    }

    // Test network connectivity
    try {
      const response = await fetch('https://httpbin.org/get', { method: 'GET' });
      results.networkConnected = response.ok;
    } catch (error) {
      results.errorLogs.push(`Network error: ${error}`);
    }

    // Test Supabase connection
    try {
      const { data, error } = await supabase.from('_supabase_migrations').select('version').limit(1);
      results.supabaseConnected = !error;
      if (error) {
        results.errorLogs.push(`Supabase error: ${error.message}`);
      }
    } catch (error) {
      results.errorLogs.push(`Supabase connection error: ${error}`);
    }

    // Test Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: 'test', language: 'en' }
      });
      results.edgeFunctionWorking = !error;
      if (error) {
        results.errorLogs.push(`Edge Function error: ${error.message}`);
      }
    } catch (error) {
      results.errorLogs.push(`Edge Function test error: ${error}`);
    }

    setDiagnostics(results);
  };

  if (!isVisible) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => setIsVisible(true)}
      >
        <IconSymbol name="gear" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App Diagnostics</Text>
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <IconSymbol name="xmark" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          
          <DiagnosticItem
            label="AsyncStorage"
            status={diagnostics.asyncStorageWorking}
            description="Local data storage"
          />
          
          <DiagnosticItem
            label="Network Connection"
            status={diagnostics.networkConnected}
            description="Internet connectivity"
          />
          
          <DiagnosticItem
            label="Supabase Connection"
            status={diagnostics.supabaseConnected}
            description="Backend database"
          />
          
          <DiagnosticItem
            label="AI Edge Function"
            status={diagnostics.edgeFunctionWorking}
            description="AI chat functionality"
          />
        </View>

        {diagnostics.errorLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Error Logs</Text>
            {diagnostics.errorLogs.map((log, index) => (
              <Text key={index} style={styles.errorLog}>
                {log}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={runDiagnostics}>
          <IconSymbol name="arrow.clockwise" size={16} color={colors.background} />
          <Text style={styles.refreshText}>Refresh Diagnostics</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

interface DiagnosticItemProps {
  label: string;
  status: boolean;
  description: string;
}

function DiagnosticItem({ label, status, description }: DiagnosticItemProps) {
  return (
    <View style={styles.diagnosticItem}>
      <View style={styles.diagnosticHeader}>
        <Text style={styles.diagnosticLabel}>{label}</Text>
        <View style={[styles.statusIndicator, { backgroundColor: status ? colors.success : colors.error }]}>
          <IconSymbol 
            name={status ? "checkmark" : "xmark"} 
            size={12} 
            color={colors.background} 
          />
        </View>
      </View>
      <Text style={styles.diagnosticDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1001,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    backgroundColor: colors.background,
    width: '90%',
    maxHeight: '70%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  diagnosticItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  diagnosticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  diagnosticLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagnosticDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorLog: {
    fontSize: 12,
    color: colors.error,
    backgroundColor: colors.error + '20',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    margin: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  refreshText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
