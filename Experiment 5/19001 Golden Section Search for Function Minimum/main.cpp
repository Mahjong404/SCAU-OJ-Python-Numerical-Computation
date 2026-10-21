#include <cmath>
#include <cstdio>

double f(double x) {
    return std::exp(x) - 2.0 * x * x;
}

int main() {
    const double golden = 0.61803398874989481;
    int m;
    std::scanf("%d", &m);
    while (m--) {
        double a, b;
        std::scanf("%lf%lf", &a, &b);
        double x1 = a + (1.0 - golden) * (b - a);
        double x2 = a + golden * (b - a);
        double y1 = f(x1), y2 = f(x2);
        while (x1 - a > 0.4e-8) {
            if (y1 >= y2) {
                a = x1;
                x1 = x2;
                y1 = y2;
                x2 = a + golden * (b - a);
                y2 = f(x2);
            } else {
                b = x2;
                x2 = x1;
                y2 = y1;
                x1 = a + (1.0 - golden) * (b - a);
                y1 = f(x1);
            }
        }
        std::printf("%.9f %.9f %.9f %.9f %.9f %.9f\n", a, x1, x2, b, y1, y2);
    }
    return 0;
}
