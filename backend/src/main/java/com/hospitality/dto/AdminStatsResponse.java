package com.hospitality.dto;

public class AdminStatsResponse {

    private Long totalUsers;
    private Long totalHotels;
    private Long totalRooms;
    private Long totalBookings;
    private Long confirmedBookings;
    private Long cancelledBookings;
    private Double totalRevenue;

    public AdminStatsResponse() {}

    public AdminStatsResponse(Long totalUsers, Long totalHotels, Long totalRooms, Long totalBookings, Long confirmedBookings, Long cancelledBookings, Double totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalHotels = totalHotels;
        this.totalRooms = totalRooms;
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
        this.cancelledBookings = cancelledBookings;
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalHotels() {
        return totalHotels;
    }

    public void setTotalHotels(Long totalHotels) {
        this.totalHotels = totalHotels;
    }

    public Long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(Long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public Long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(Long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
