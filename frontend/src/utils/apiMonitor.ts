interface ApiMetrics {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  status?: number;
  error?: Error;
}

class ApiMonitor {
  private static instance: ApiMonitor;
  private metrics: ApiMetrics[] = [];
  private readonly MAX_METRICS = 1000;
  private readonly SLOW_THRESHOLD = 3000; // 3 seconds

  private constructor() {}

  static getInstance(): ApiMonitor {
    if (!ApiMonitor.instance) {
      ApiMonitor.instance = new ApiMonitor();
    }
    return ApiMonitor.instance;
  }

  startRequest(url: string, method: string): string {
    const requestId = Math.random().toString(36).substring(7);
    this.metrics.push({
      url,
      method,
      startTime: performance.now(),
    });
    return requestId;
  }

  endRequest(requestId: string, status: number, error?: Error) {
    const metric = this.metrics.find(m => m.url.includes(requestId));
    if (metric) {
      metric.endTime = performance.now();
      metric.status = status;
      metric.error = error;

      const duration = metric.endTime - metric.startTime;
      if (duration > this.SLOW_THRESHOLD) {
        console.warn(`Slow API request detected: ${metric.url} (${duration.toFixed(2)}ms)`);
      }

      if (error) {
        console.error(`API request failed: ${metric.url}`, error);
      }

      // Trim metrics if exceeding max size
      if (this.metrics.length > this.MAX_METRICS) {
        this.metrics = this.metrics.slice(-this.MAX_METRICS);
      }
    }
  }

  getMetrics() {
    return this.metrics.map(metric => ({
      ...metric,
      duration: metric.endTime ? metric.endTime - metric.startTime : null,
    }));
  }

  getAverageResponseTime() {
    const completedRequests = this.metrics.filter(m => m.endTime);
    if (completedRequests.length === 0) return 0;

    const totalDuration = completedRequests.reduce(
      (sum, m) => sum + (m.endTime! - m.startTime),
      0
    );
    return totalDuration / completedRequests.length;
  }

  getErrorRate() {
    const completedRequests = this.metrics.filter(m => m.endTime);
    if (completedRequests.length === 0) return 0;

    const errorCount = completedRequests.filter(m => m.error).length;
    return (errorCount / completedRequests.length) * 100;
  }

  getSlowRequests(threshold = this.SLOW_THRESHOLD) {
    return this.metrics
      .filter(m => m.endTime && m.endTime - m.startTime > threshold)
      .map(m => ({
        ...m,
        duration: m.endTime! - m.startTime,
      }));
  }

  clearMetrics() {
    this.metrics = [];
  }
}

export const apiMonitor = ApiMonitor.getInstance();

// Axios interceptor setup
export const setupApiMonitoring = (axios: any) => {
  // Add auth token to all requests
  axios.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const requestId = apiMonitor.startRequest(config.url, config.method);
      config.metadata = { requestId };
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response: any) => {
      const requestId = response.config.metadata.requestId;
      apiMonitor.endRequest(requestId, response.status);
      return response;
    },
    (error: any) => {
      const requestId = error.config?.metadata?.requestId;
      if (requestId) {
        apiMonitor.endRequest(
          requestId,
          error.response?.status || 0,
          error
        );
      }
      return Promise.reject(error);
    }
  );
}; 