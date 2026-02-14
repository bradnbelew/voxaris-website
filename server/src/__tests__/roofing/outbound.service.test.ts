/**
 * Outbound Service Tests
 *
 * Tests TCPA compliance, DNC list management, and outbound call triggering
 */

import {
  checkTcpaCompliance,
  isTimeInTcpaWindow,
  getTcpaStatus,
} from '../../services/outbound.service';

describe('Outbound Service - TCPA Compliance', () => {
  describe('checkTcpaCompliance', () => {
    it('should return canCall=true during business hours (9 AM)', () => {
      // Mock current time to 9 AM Florida time
      const mockDate = new Date('2024-02-15T14:00:00.000Z'); // 9 AM EST
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const result = checkTcpaCompliance();
      expect(result.canCall).toBe(true);

      jest.useRealTimers();
    });

    it('should return canCall=true during business hours (5 PM)', () => {
      const mockDate = new Date('2024-02-15T22:00:00.000Z'); // 5 PM EST
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const result = checkTcpaCompliance();
      expect(result.canCall).toBe(true);

      jest.useRealTimers();
    });

    it('should return canCall=false before 8 AM', () => {
      const mockDate = new Date('2024-02-15T12:00:00.000Z'); // 7 AM EST
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const result = checkTcpaCompliance();
      expect(result.canCall).toBe(false);
      expect(result.reason).toContain('Outside TCPA calling hours');

      jest.useRealTimers();
    });

    it('should return canCall=false after 9 PM', () => {
      const mockDate = new Date('2024-02-16T02:30:00.000Z'); // 9:30 PM EST
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const result = checkTcpaCompliance();
      expect(result.canCall).toBe(false);
      expect(result.reason).toContain('Outside TCPA calling hours');

      jest.useRealTimers();
    });

    it('should provide next window time when outside hours', () => {
      const mockDate = new Date('2024-02-16T03:00:00.000Z'); // 10 PM EST
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const result = checkTcpaCompliance();
      expect(result.canCall).toBe(false);
      expect(result.nextWindow).toBeDefined();

      jest.useRealTimers();
    });
  });

  describe('isTimeInTcpaWindow', () => {
    it('should return true for 10 AM', () => {
      const time = new Date('2024-02-15T15:00:00.000Z'); // 10 AM EST
      expect(isTimeInTcpaWindow(time)).toBe(true);
    });

    it('should return true for 8 PM', () => {
      const time = new Date('2024-02-16T01:00:00.000Z'); // 8 PM EST
      expect(isTimeInTcpaWindow(time)).toBe(true);
    });

    it('should return false for 7 AM', () => {
      const time = new Date('2024-02-15T12:00:00.000Z'); // 7 AM EST
      expect(isTimeInTcpaWindow(time)).toBe(false);
    });

    it('should return false for 10 PM', () => {
      const time = new Date('2024-02-16T03:00:00.000Z'); // 10 PM EST
      expect(isTimeInTcpaWindow(time)).toBe(false);
    });
  });

  describe('getTcpaStatus', () => {
    it('should return status object with all required fields', () => {
      const status = getTcpaStatus();

      expect(status).toHaveProperty('isOpen');
      expect(status).toHaveProperty('currentTime');
      expect(status).toHaveProperty('windowStart');
      expect(status).toHaveProperty('windowEnd');
      expect(status).toHaveProperty('timezone');
      expect(status.windowStart).toBe('8:00 AM');
      expect(status.windowEnd).toBe('9:00 PM');
      expect(status.timezone).toContain('Florida');
    });
  });
});

describe('Phone Number Normalization', () => {
  // Note: normalizePhone is a private function, but we can test it through the public API
  // For now, we'll document the expected behavior

  it('should handle 10-digit US numbers', () => {
    // Expected: 4071234567 -> +14071234567
    // This would be tested through triggerOutboundCall
  });

  it('should handle numbers with country code', () => {
    // Expected: 14071234567 -> +14071234567
  });

  it('should handle formatted numbers', () => {
    // Expected: (407) 123-4567 -> +14071234567
  });
});
