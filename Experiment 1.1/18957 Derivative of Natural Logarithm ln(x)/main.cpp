#include <cstdio>

int main() {
    int m;
    std::scanf("%d", &m);
    while (m--) {
        double x;
        std::scanf("%lf", &x);
        std::printf("%.2f\n", 1.0 / x);
    }
    return 0;
}
